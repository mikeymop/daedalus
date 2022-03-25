#!/usr/bin/env bash
set -e

echo '~~~ Obtaining pkgs.nixUnstable'

myDir=$(dirname "$0")
nixUnstable=$(nix-build "$myDir"/../default.nix -A pkgs.nixUnstable)

PATH="$nixUnstable/bin:$PATH"

nix --version

exec "$myDir/build-installer-unix.sh-ORIGINAL" "$@"
